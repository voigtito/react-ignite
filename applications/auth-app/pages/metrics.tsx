import { GetServerSideProps } from "next";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";
import decode from 'jwt-decode';

export default function Metrics() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth( async (context) => {
  const apiClient = setupAPIClient(context);
  const response = await apiClient.get('/me');

  
  const user = decode()

  return {
    props: {}
  }
});