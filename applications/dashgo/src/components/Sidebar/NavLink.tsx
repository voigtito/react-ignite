import { Box, Text, Link as ChakraLink, Icon, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";
import Link from 'next/link';


interface NavLinkProps extends ChakraLinkProps{
    icon: ElementType;
    children: string;
    href: string;
}
export function NavLink({icon, children, href, ...rest}:NavLinkProps) {
    return (
        <Link href={href} passHref>
            <ChakraLink display="flex" align="center" py="1" {...rest}>
                <Icon as={icon} fontSize="20"></Icon>
                <Text ml="4" fontWeight="medium">{children}</Text>
            </ChakraLink>
        </Link>
    )
}
