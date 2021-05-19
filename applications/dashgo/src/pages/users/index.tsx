import { Box, Flex, Heading, Button, Icon, Table, Thead, Tr, Th, Td, Tbody, Checkbox, Text, useBreakpointValue, Spinner } from '@chakra-ui/react';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { ImSpinner11 } from 'react-icons/im';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Pagination } from '../../components/Pagination';
import Link from 'next/link';
import { useUsers } from '../../services/hooks/useUsers';

export default function UserList() {

  const { data, isLoading, isFetching, error, refetch } = useUsers();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  return (
    <Box>
      <Header />
      <Flex w="100%" maxWidth={1480} mx="auto" px="6" mt="4">
        <Sidebar />
        <Box flex="1" borderRadius={8} p="8" bg="gray.800">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
                            {
                !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />
              }
              {
                !isLoading && !isFetching && <Icon cursor="pointer" color="gray.500" borderRadius="4" as={ImSpinner11} fontSize={16} onClick={() => refetch()} ml="4" />
              }
            </Heading>
            <Flex align="center">
              <Link href="/users/create" passHref>
                <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} fontSize="20" />}>
                  Criar novo
                                </Button>
              </Link>
            </Flex>
          </Flex>
          {
            isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            )
              :
              error ? (
                <Flex justify="center">
                  <Text>Falha ao obter os dados do usuário.</Text>
                </Flex>
              ) : (
                <>
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="8">
                          <Checkbox colorScheme="pink" />
                        </Th>
                        <Th>Usuário</Th>
                        {isWideVersion && <Th>Data de cadastro</Th>}
                        {isWideVersion && <Th></Th>}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map(user => (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Text fontWeight="bold">{user.name}</Text>
                              <Text fontSize="sm" color="gray.300">{user.email}</Text>
                            </Box>
                          </Td>
                          {isWideVersion && <Td>{user.createdAt}</Td>}
                          {isWideVersion && <Td>
                            <Button as="a" size="sm" fontSize="sm" colorScheme="purple" leftIcon={<Icon as={RiPencilLine} fontSize="16" />}>
                              Editar
                            </Button>
                          </Td>}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  <Pagination />
                </>
              )
          }
        </Box>
      </Flex>
    </Box>
  )
}