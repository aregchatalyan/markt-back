import { useCallback, useState } from 'react';

const BASE_URL = 'https://localhost:3030/api';

export const useHttp = () => {
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ redirectTo, setRedirectTo ] = useState('');

  const http = useCallback(async (endpoint, method = 'GET', body = null, headers = {}) => {
    setLoading(true);
    const controller = new AbortController();

    try {
      if (body) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(
        `${ BASE_URL }/${ endpoint }`,
        { method, body, headers, credentials: 'include', signal: controller.signal }
      );

      if (response.ok) {
        const response_data = await response.json();
        if (response_data?.data?.access_token) {
          localStorage.setItem('access_token', response_data?.data?.access_token);
        }

        setLoading(false);
        return response_data;
      } else if (response.status === 401) {
        // Token refresh with timeout
        const refresh_timeout = new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Token refresh request timed out')), 5000);
        });

        const refresh_response = await Promise.race([
          fetch(`${ BASE_URL }/auth/refresh`, { method: 'GET', credentials: 'include' }),
          refresh_timeout
        ]);

        if (refresh_response.ok) {
          const refreshed_data = await refresh_response.json();
          localStorage.setItem('access_token', refreshed_data?.data?.access_token);

          const retry_response = await fetch(`${ BASE_URL }/${ endpoint }`, {
            method,
            body,
            headers: { Authorization: `Bearer ${ refreshed_data?.data?.access_token }` },
            credentials: 'include'
          });

          setLoading(false);
          return await retry_response.json();
        } else {
          // Refresh token invalid. Redirect to log in page.
          controller.abort();
          const response = await fetch(`${ BASE_URL }/auth/logout`, { method: 'POST' });
          localStorage.removeItem('access_token');
          return setRedirectTo(response.url);
        }
      } else {
        throw new Error('Request failed.');
      }
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { http, loading, redirectTo, error, clearError };
}
