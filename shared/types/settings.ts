declare global {
  interface SettingsParams {
    id: string;
  }

  interface Settings {
    execution: string;
    pageHead?: Record<string, any>;
    pages: Record<string, Page>;
    theme?: Theme;
    schedule?: Schedule;
  }

  interface Page {
    template: string;
    pageHead?: Record<string, any>;
    sections: Section[];
    states?: Array<string>;
    props?: Record<string, any>;
    classes?: Record<string, any>;
  }

  interface Section {
    id: string;
    component: string;
    props?: Record<string, any>;
    attrs?: Record<string, any>;
    alert?: Record<string, any>;
    classes?: Record<string, any>;
    schema?: Array<Record<string, any>>;
    state?: string; // state of the section
    states?: Array<string>; // state of the section
    sections?: Section[]; // Nested sections
    style?: Record<string, any>;
  }

  interface Theme {
    colors?: Record<string, string>;
    file?: string;
    fonts?: {
      heading?: string;
      body?: string;
    };
    form?: string;
  }

  interface DateTimeRange {
    startDateTime: string;
    endDateTime: string;
  }

  interface Schedule {
    registration: DateTimeRange;
    redemption: DateTimeRange;
  }

  // todo: Add interface for settings error

  interface SettingsResponse extends BaseResponse<Settings> {}
}

export type {};
