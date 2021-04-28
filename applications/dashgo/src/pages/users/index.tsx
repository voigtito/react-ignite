import { Box, Flex, Heading, Button, Icon, Table, Thead, Tr, Th, Tbody  } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

export default function UserList() {
    return (
        <Box>
            <Header />
            <Flex w="100%" maxWidth={1480} mx="auto" px="6" mt="4">
                <Sidebar/>

                <Box flex="1" borderRadius={8} p="8" bg="gray.800">
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">Usuários</Heading>
                        <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} fontSize="20" />}>
                            Criar novo
                        </Button>
                    </Flex>
                    <Table colorScheme="whiteAlpha">
                        <Thead>
                            <Tr>
                                <Th>

                                </Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Box>
            </Flex>
        </Box>
    )
}