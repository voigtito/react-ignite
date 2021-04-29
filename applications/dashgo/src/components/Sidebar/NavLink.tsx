import { Box, Stack, Text, Link, Icon } from "@chakra-ui/react";
import { RiInputMethodLine, RiGitMergeLine } from "react-icons/ri";

export function NavLink() {
    return (
        <Box>
            <Link display="flex" align="center" py="1">
                <Icon as={RiInputMethodLine} fontSize="20"></Icon>
                <Text ml="4" fontWeight="medium">Formulários</Text>
            </Link>
        </Box>
    )
}
