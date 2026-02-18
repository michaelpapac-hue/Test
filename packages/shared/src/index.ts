export type UserRole = 'SUPER' | 'PM' | 'EXEC' | 'SAFETY' | 'ADMIN';

export interface RiskFlag {
  code:
    | 'MISSING_HARD_HAT'
    | 'MISSING_VEST'
    | 'NO_FALL_PROTECTION'
    | 'LADDER_MISUSE'
    | 'OPEN_TRENCH'
    | 'IMPROPER_PPE';
  severity: number;
}
