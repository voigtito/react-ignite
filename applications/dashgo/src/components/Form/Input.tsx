import { Input as ChakraInput, FormLabel, FormControl, InputProps as ChakraInputProps } from '@chakra-ui/react'

interface InputProps extends ChakraInputProps{
    name: string;
    label?: string;
}

export function Input({name, label, ...rest}: InputProps) {
    return (
        <FormControl>
        {/* FormControl is used for the label and input. So they wont receive the spacing from the Stack comp. */}
        {/* All elements with action properties has _ in front of it. Like the _hover property */}
            {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <ChakraInput
              name={name}
              id={name}
              focusBorderColor="pink.500"
              bgColor="gray.900"
              variant="filled"
              _hover={{ bgColor: 'gray.900' }}
              size="lg"
              {...rest}
            />
          </FormControl>
    )
}