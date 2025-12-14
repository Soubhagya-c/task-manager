import React from 'react';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <header>
        <h1>App</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
