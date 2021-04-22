import {AppProps} from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  // resetCSS removes all default data from html styles.
  return(
  <ChakraProvider resetCSS theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>)
}

export default MyApp
