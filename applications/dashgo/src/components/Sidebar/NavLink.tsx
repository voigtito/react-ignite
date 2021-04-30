import { Box, Text, Link, Icon, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";
import { RiInputMethodLine } from "react-icons/ri";

interface NavLinkProps extends ChakraLinkProps{
    icon: ElementType;
    children: string;
}
export function NavLink({icon, children, ...rest}:NavLinkProps) {
    return (
        <Box>
            <Link display="flex" align="center" py="1" {...rest}>
                <Icon as={icon} fontSize="20"></Icon>
                <Text ml="4" fontWeight="medium">{children}</Text>
            </Link>
        </Box>
    )
}
