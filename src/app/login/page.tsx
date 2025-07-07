import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

async function handleLogin(formData: FormData) {
  'use server';
  
  const token = formData.get('token') as string;
  
  if (!token?.trim()) {
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke('handle-login', {
      body: { token }
    });

    if (error) {
      console.error('Login error:', error);
      redirect('/login?error=true');
      return;
    }

    if (data?.playerExists) {
      redirect('/game');
    } else {
      redirect(`/username?ip=${data?.ip}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    redirect('/login?error=true');
  }
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Oyuna Giriş
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Token ile giriş yapın
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleLogin}>
          <div>
            <label htmlFor="token" className="sr-only">
              Token
            </label>
            <input
              id="token"
              name="token"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Token girin"
            />
          </div>

          {searchParams.error && (
            <div className="text-red-600 text-sm text-center">
              Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
