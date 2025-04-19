import ky from '../lib/ky';

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export async function requestAPI<T>(
  url: string,
  method: RequestMethod,
  body?: unknown
): Promise<T> {
  try {
    const responseData = await ky(url, {
      method,
      ...(body ? { json: body } : {}),
    }).json<T>();

    return responseData;
  } catch (error) {
    throw error;
  }
}
