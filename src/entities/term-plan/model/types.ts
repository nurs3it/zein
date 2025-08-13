// Типы для term-plan на основе API схемы

export interface TermPlanTask {
  id: number;
  created_at: string;
  updated_at: string;
  instruction: string;
  order: number;
  task_type: TaskTypeEnum;
  task_subtype: TaskSubtypeEnum;
}

export interface TermPlanTaskRequest {
  created_at: string;
  instruction: string;
  order: number;
  task_type: TaskTypeEnum;
  task_subtype: TaskSubtypeEnum;
}

export interface ShortTermPlan {
  id: number;
  created_at: string;
  updated_at: string;
  user: UserDetail;
  lesson_topic: string;
  learning_objectives: string[] | null;
  lesson_goal: string;
  class_number: number;
  subject: string;
  subject_type: SubjectTypeEnum | null;
  result_path: string | null;
  status: ShortTermPlanStatusEnum;
  error_message: string | null;
  lang: LangEnum | null;
  system_prompt: string | null;
  suggested_text: string | null;
  theory: string | null;
  first_term_plan_task: TermPlanTask;
  second_term_plan_task: TermPlanTask;
  third_term_plan_task: TermPlanTask;
  subject_ref: Subject;
}

export interface ShortTermPlanRequest {
  created_at: string;
  lesson_topic: string;
  learning_objectives: string[] | null;
  lesson_goal: string;
  class_number: number;
  subject: string;
  subject_type: SubjectTypeEnum | null;
  result_path: string | null;
  status: ShortTermPlanStatusEnum;
  error_message: string | null;
  lang: LangEnum | null;
  system_prompt: string | null;
  suggested_text: string | null;
  theory: string | null;
}

export interface Subject {
  id: number;
  created_at: string;
  updated_at: string;
  title_kk: string | null;
  title_ru: string | null;
  title_en: string | null;
}

// Enums
export enum TaskTypeEnum {
  AQPARAT_AGYNY = 'aqparat_agyny',
  THEORY_BOLIMI = 'theory_bolimi',
  TOPTYQ_ZHUMYS = 'toptyq_zhumys',
}

export enum TaskSubtypeEnum {
  BOLZAU_MODELDEU = 'bolzau_modeldeu',
  TUSINU_TALDAU = 'tusinu_taldau',
  SOZDIK_KORY = 'sozdik_kory',
  SHYGARMASHYLYK_DAMU = 'shygarmashylyk_damu',
  TEORIYA_ZERTTEU = 'teoriya_zertteu',
  TALDAU_KURYLYM = 'taldau_kurylym',
  KESTE_TOLTYRU = 'keste_toltyru',
  PRAKTIKALYK_ZHATTYGU = 'praktikalyk_zhattygu',
  ZHUMYSTYK_ZHUMYS = 'zhumystyk_zhumys',
  PIKIRTALAS = 'pikirtalas',
  TOPTYK_ZHARYS = 'toptyk_zharys',
  INTERAKTIVTI_ZHABA = 'interaktivti_zhaba',
}

export enum ShortTermPlanStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum SubjectTypeEnum {
  HUMANITIES = 'humanities',
  TECHNICAL = 'technical',
  NATURAL_SCIENCES = 'natural_sciences',
  LANGUAGE = 'language',
  ELEMENTARY = 'elementary',
}

export enum LangEnum {
  KK = 'kk',
  RU = 'ru',
  EN = 'en',
}

// Дополнительные типы для пользователя
export interface UserDetail {
  id: number;
  email: string;
  name: string;
  date_joined: string;
  is_active: boolean;
}

// Типы для фильтрации и пагинации
export interface TermPlanFilters {
  created_after?: string;
  created_before?: string;
  created_at?: string;
  created_at__day?: number;
  created_at__month?: number;
  created_at__year?: number;
  date_from?: string;
  date_to?: string;
  is_active?: boolean;
  is_completed?: boolean;
  status?: string;
  subject?: string;
  subject_type?: SubjectTypeEnum;
  class_number?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  updated_after?: string;
  updated_before?: string;
  updated_at?: string;
  updated_at__day?: number;
  updated_at__month?: number;
  updated_at__year?: number;
}
