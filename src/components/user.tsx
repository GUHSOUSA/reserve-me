'use client';

const User = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user) {
    return <p>Usuário não logado.</p>;
  }

  return (
    <div>
      <h1>Informações do Usuário</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default User;
