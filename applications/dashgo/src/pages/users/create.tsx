import { Box, Flex, Heading, Divider, VStack, HStack, SimpleGrid, Button } from '@chakra-ui/react';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Input } from '../../components/Form/Input';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateUserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }
  
  const createUserFromSchema = yup.object().shape({
    name: yup.string().required("E-mail obrigatório"),
    email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
    password: yup.string().required("Senha obrigatória").min(6, 'Senha precisa no mínimo 6 caracteres'),
    password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
  })

export default function UserCreate() {

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFromSchema)
    })

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log(values)
    }

    return (
        <Box>
            <Header />
            <Flex w="100%" maxWidth={1480} mx="auto" px="6" mt="4">
                <Sidebar />
                <Box as="form" onSubmit={handleSubmit(handleCreateUser)} flex="1" borderRadius={8} p={["6", "8"]} bg="gray.800">
                    <Heading size="lg" fontWeight="normal">Criar usuário</Heading>
                    <Divider my="6" borderColor="gray.700" />
                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input error={formState.errors.name} name="name" label="Nome completo" {...register('name')} />
                            <Input error={formState.errors.email} name="email" label="E-mail" {...register('email')} />
                        </SimpleGrid>
                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input error={formState.errors.password} name="password" label="Senha" {...register('password')}/>
                            <Input error={formState.errors.password_confirmation} name="password_confirmation" type="password" label="Confirmação da senha" {...register('password_confirmation')}/>
                        </SimpleGrid>
                    </VStack>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                                <Button colorScheme="whiteAlpha" >Cancelar</Button>
                            </Link>
                            <Button type="submit" isLoading={formState.isSubmitting} colorScheme="pink">Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}