export type MainApiResponse<ResponseData> = {
  meta: {
    count: number;
    offset: number | null;
    limit: number | null;
  };
  response: {
    data: ResponseData;
    error: any;
    error_message: string;
    message: string;
    http_status: number;
    http_message: string;
  };
};

type MasterSuccess<Data> = {
  rc?: number;
  message?: string;
  data?: Data;
  ts?: string;
  error_msg?: string;
};

export type MasterCategory = {
  nama: string;
  id: number;
};

export type MasterApiResponse<ResponseData> = {
  status: number;
} & MasterSuccess<ResponseData>;
