export const JOB_TITLE = "Grounds Maintenance Specialist";
export const COMPANY_NAME = "GreenValley Golf & Country Club";

export const INTRO_TEXT = `
Thank you for your interest in joining the GreenValley family. We take immense pride in the pristine condition of our course, and our maintenance team is the heart of that effort. 

This role is vital to our operations. Before you begin, we want to be transparent about the nature of the work to ensure it is a perfect fit for you.
`;

export const ACKNOWLEDGMENTS = [
  {
    key: 'ackOutdoor',
    text: "I understand this position requires working outdoors 95% of the time, in various weather conditions including summer heat, rain, and cold mornings."
  },
  {
    key: 'ackPhysical',
    text: "I am comfortable with the physical demands of the job, which include frequent lifting (up to 50lbs), stooping, bending, and long periods on my feet."
  },
  {
    key: 'ackMachinery',
    text: "I am willing to operate heavy maintenance machinery (mowers, aerators, tractors) safely and responsibly (training provided)."
  },
  {
    key: 'ackCustomers',
    text: "I understand that I will be working around golfers. While most are wonderful, some can be focused or frustrated with their game. I agree to remain kind, professional, and invisible to their play whenever possible."
  },
  {
    key: 'ackExhaustion',
    text: "I acknowledge that while the work is straightforward, it can be physically exhausting by the end of the day. I am prepared for an active, labor-intensive role."
  }
];

export const DEFAULT_STATE: any = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  positionType: '',
  startDate: '',
  experience: '',
  references: '',
  whyGreenValley: '',
  ackOutdoor: false,
  ackPhysical: false,
  ackMachinery: false,
  ackCustomers: false,
  ackExhaustion: false,
};
