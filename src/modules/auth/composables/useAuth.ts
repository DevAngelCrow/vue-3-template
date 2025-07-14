export function useAuth() {
  const login = (user: string, password: string) => {
    console.log(user, 'Usuario');
    console.log(password, 'Password');
  };

  return {
    login,
  };
}
