import { Flex, Text, Box, Avatar } from '@chakra-ui/react';

export function Profile() {
    return (
        <Flex align="center">
            <Box mr="4" textAlign="right">
                <Text>Gustavo Voigt</Text>
                <Text color="gray.300" fontSize="small">gustavo@gmail.com</Text>
            </Box>
            <Avatar size="md" name="Gustavo Voigt" />
        </Flex>
    )
}