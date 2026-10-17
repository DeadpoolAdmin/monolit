import React from 'react';
import '@shared/styles/index.scss';
import '@shared/hooks/windowResize';
import { AppRouter } from './Router/AppRouter';

const App = () => {
   return <AppRouter />
};

export default React.memo(App);
console.log('hello world');
console.log('Vahe');
