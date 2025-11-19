import React, { useState, useEffect } from 'react';
import { COMPANY_NAME, JOB_TITLE, INTRO_TEXT, ACKNOWLEDGMENTS, DEFAULT_STATE } from './constants';
import { ApplicationState, ParsedResumeData } from './types';
import { ResumeUploader } from './components/ResumeUploader';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState<ApplicationState>(DEFAULT_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('greenValleyAppDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load saved draft");
      }
    }

    // Theme initialization
    const savedTheme = localStorage.getItem('greenValleyTheme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Apply theme to HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('greenValleyTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Save handler
  const handleSave = () => {
    localStorage.setItem('greenValleyAppDraft', JSON.stringify(formData));
    setSaveMessage("Progress saved! You can close this tab and resume your application later.");
    setTimeout(() => setSaveMessage(null), 5000);
  };

  // Input Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Checkbox Handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Resume Parsed Handler
  const handleResumeParsed = (data: ParsedResumeData) => {
    setFormData(prev => ({
      ...prev,
      firstName: data.firstName || prev.firstName,
      lastName: data.lastName || prev.lastName,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      address: data.address || prev.address,
      experience: data.experienceSummary ? `${data.experienceSummary}\n\n${prev.experience}`.trim() : prev.experience
    }));
  };

  // Validation Logic
  const isFullTime = formData.positionType === 'Full-Time';
  const isPartTime = formData.positionType === 'Part-Time';
  const allAckChecked = ACKNOWLEDGMENTS.every(ack => (formData as any)[ack.key]);
  
  const canSubmit = 
    formData.firstName && 
    formData.lastName && 
    formData.email && 
    formData.phone && 
    formData.positionType === 'Full-Time' && 
    allAckChecked;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    // Mock Submission
    console.log("Submitting Application:", formData);
    setSubmitted(true);
    localStorage.removeItem('greenValleyAppDraft');
    window.scrollTo(0,0);
  };

  // Shared Input Styles
  const inputClasses = "w-full rounded-lg bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-100 placeholder-stone-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2 px-3 border transition-colors";
  const labelClasses = "block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-t-8 border-emerald-600 animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-4">Thank You!</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            Your application for the <strong>{JOB_TITLE}</strong> position at {COMPANY_NAME} has been received. 
            We appreciate the time you took to complete the transparency acknowledgments.
          </p>
          <p className="text-stone-600 dark:text-stone-400 mb-8">
            Our team will review your information and reach out via email within 3-5 business days if we believe there is a strong match.
          </p>
          <Button onClick={() => window.location.reload()}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20 text-stone-900 dark:text-stone-200 transition-colors duration-300">
      {/* Sticky Save Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
         {saveMessage && (
            <div className="bg-emerald-700 text-emerald-50 border border-emerald-600 px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-up flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {saveMessage}
            </div>
         )}
         <button 
           onClick={handleSave}
           className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 shadow-lg hover:shadow-xl hover:bg-stone-100 dark:hover:bg-stone-700 px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 group"
           title="Save progress and resume later"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
           </svg>
           Save Progress
         </button>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 pt-16 pb-24 px-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/1920/600?grayscale')] bg-cover bg-center mix-blend-overlay dark:mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/80 to-stone-50/95 dark:from-stone-900/80 dark:to-stone-900/95 pointer-events-none"></div>
        
        {/* Theme Toggle Top Right */}
        <button 
          onClick={toggleTheme} 
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all text-stone-600 dark:text-stone-300"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? (
             // Sun Icon
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
          ) : (
             // Moon Icon
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
             </svg>
          )}
        </button>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-stone-900 dark:text-white">{COMPANY_NAME}</h1>
          <p className="text-emerald-600 dark:text-emerald-400 text-lg md:text-xl uppercase tracking-widest mb-6 font-medium">Career Opportunity</p>
          <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-100 bg-white/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 inline-block px-6 py-2 rounded-lg backdrop-blur-md shadow-lg">
            {JOB_TITLE}
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Introduction Card */}
        <div className="bg-white dark:bg-stone-900 rounded-xl shadow-xl p-8 mb-8 border-t border-x border-stone-200 dark:border-stone-800 border-b-4 border-b-emerald-600 transition-colors duration-300">
          <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mb-4">Welcome</h3>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {INTRO_TEXT}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Role Transparency Section */}
          <section className="bg-white dark:bg-stone-900 rounded-xl p-8 border border-stone-200 dark:border-stone-700 shadow-sm transition-colors duration-300">
            <h3 className="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Role Transparency & Requirements
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
              To ensure your success and happiness in this role, please confirm you are comfortable with the following working conditions.
            </p>

            <div className="space-y-4">
              {ACKNOWLEDGMENTS.map((ack) => (
                <label key={ack.key} className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition-colors cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name={ack.key}
                    checked={(formData as any)[ack.key]}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-5 h-5 text-emerald-600 bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 rounded focus:ring-emerald-500 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-900"
                  />
                  <span className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed select-none group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">{ack.text}</span>
                </label>
              ))}
            </div>
            
            {!allAckChecked && (
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-4 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Please acknowledge all conditions to proceed with the application.
              </p>
            )}
          </section>

          {/* Resume Upload */}
          <ResumeUploader onDataParsed={handleResumeParsed} />

          {/* Personal Details */}
          <section className="bg-white dark:bg-stone-900 rounded-xl shadow-sm p-8 border border-stone-200 dark:border-stone-700 transition-colors duration-300">
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Current Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          {/* Availability & Employment */}
          <section className="bg-white dark:bg-stone-900 rounded-xl shadow-sm p-8 border border-stone-200 dark:border-stone-700 transition-colors duration-300">
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mb-6">Employment Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className={labelClasses + " mb-2"}>Position Preference</label>
                <div className="flex gap-4">
                   <label className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="positionType" 
                        value="Full-Time" 
                        checked={formData.positionType === 'Full-Time'} 
                        onChange={handleChange}
                        className="text-emerald-600 bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-emerald-500 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-900 h-4 w-4"
                      />
                      <span className="ml-2 text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">Full-Time (40 hrs/week)</span>
                   </label>
                   <label className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="positionType" 
                        value="Part-Time" 
                        checked={formData.positionType === 'Part-Time'} 
                        onChange={handleChange}
                        className="text-emerald-600 bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-emerald-500 focus:ring-offset-stone-100 dark:focus:ring-offset-stone-900 h-4 w-4"
                      />
                      <span className="ml-2 text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">Part-Time</span>
                   </label>
                </div>

                {/* WARNING ALERT FOR PART TIME */}
                {isPartTime && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 p-4 rounded-r-md animate-fade-in-up">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          <strong>Notice:</strong> At this time, we are strictly hiring for <strong>Full-Time</strong> positions to ensure the continuity of care for our grounds. 
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-200/80 mt-1">
                          Please select "Full-Time" if your schedule allows, otherwise we may not be able to process your application today.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClasses}>Earliest Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange}
                  className={`${inputClasses} w-full md:w-1/2 [color-scheme:light] dark:[color-scheme:dark]`}
                />
              </div>

              <div>
                <label className={labelClasses}>Relevant Experience</label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Please list previous landscaping, maintenance, or manual labor experience.</p>
                <textarea 
                  name="experience" 
                  rows={5}
                  value={formData.experience} 
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="E.g. Worked for City Landscaping 2019-2021..."
                ></textarea>
              </div>

              <div>
                 <label className={labelClasses}>Professional References</label>
                 <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Please provide the name, phone number, and relationship for two professional references.</p>
                 <textarea 
                  name="references"
                  rows={3}
                  value={formData.references}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="1. Name - Phone - Relationship&#10;2. Name - Phone - Relationship"
                 ></textarea>
              </div>

              <div>
                 <label className={labelClasses}>Why {COMPANY_NAME}?</label>
                 <textarea 
                  name="whyGreenValley"
                  rows={3}
                  value={formData.whyGreenValley}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Tell us why you would be a good fit for our team."
                 ></textarea>
              </div>
            </div>
          </section>

          {/* Submission Area */}
          <div className="pt-4 pb-12 text-center">
            <div className="mb-4 text-sm text-stone-500 dark:text-stone-500 max-w-lg mx-auto">
              By clicking "Submit Application", you confirm that the information provided is accurate and you accept the working conditions described above.
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={handleSave}
                  className="w-full md:w-auto"
                >
                  Save Draft
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full md:w-auto md:min-w-[200px] text-lg"
                  disabled={!canSubmit}
                >
                  Submit Application
                </Button>
            </div>
            
            {!canSubmit && (
               <p className="mt-4 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-2 rounded inline-block animate-pulse-subtle">
                 Please complete all required fields, select "Full-Time", and check all acknowledgments to proceed.
               </p>
            )}
          </div>

        </form>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-8 text-center text-stone-500 text-sm transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
        <p className="mt-1">We are an equal opportunity employer.</p>
      </footer>
    </div>
  );
};

export default App;