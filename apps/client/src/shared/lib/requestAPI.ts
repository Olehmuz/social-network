import ky from '../lib/ky';

export async function requestAPI<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
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
