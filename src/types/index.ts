export interface User {
    id: number;
    name: string;
    email: string;
    salary: number;
  }

  export interface SalaryCalculationResult {
    user: User;
    grossMonthly: number;
    taxPercent: number;
    taxAmount: number;
    netMonthly: number;
    netAnnual: number;
  }

  export interface TaxSlab {
    id: number;
    min_salary: number;
    max_salary: number;
    tax_percent: number;
  }

  
  export interface BenefitUpdatePayload {
    [benefitName: string]: number;
  }

  