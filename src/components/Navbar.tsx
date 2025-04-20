import { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Container,
  Image,
  Text,
  Stack,
  Collapse,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Convert',
    href: '#',
    children: [
      {
        label: 'Word to PDF',
        href: '/word-to-pdf',
      },
      {
        label: 'PPT to PDF',
        href: '/ppt-to-pdf',
      },
      {
        label: 'Excel to PDF',
        href: '/excel-to-pdf',
      },
      {
        label: 'Image to PDF',
        href: '/image-to-pdf',
      },
    ],
  },
  {
    label: 'Tools',
    href: '#',
    children: [
      {
        label: 'Merge PDF',
        href: '/merge',
      },
      {
        label: 'Split PDF',
        href: '/split',
      },
      {
        label: 'Compress PDF',
        href: '/compress',
      },
    ],
  },
];

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const menuBg = useColorModeValue('white', 'gray.800');
  const menuHoverBg = useColorModeValue('gray.50', 'gray.700');
  const activeColor = useColorModeValue('purple.600', 'purple.300');
  const navbarShadow = isScrolled ? 'sm' : 'none';

  return (
    <Box 
      position="sticky" 
      top={0} 
      zIndex={1000}
      bg={bg}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
      transition="all 0.3s"
      boxShadow={navbarShadow}
    >
      <Container maxW="container.xl">
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          align="center"
        >
          {/* Mobile menu button */}
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </Flex>

          {/* Logo */}
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <RouterLink to="/">
              <HStack spacing={2}>
                {/* <Image src="/logo.svg" h="32px" alt="Logo" /> */}
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, purple.500, purple.300)"
                  bgClip="text"
                  display={{ base: 'none', md: 'block' }}
                >
                  BigPDF
                </Text>
              </HStack>
            </RouterLink>

            {/* Desktop Navigation */}
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <HStack spacing={4}>
                {NAV_ITEMS.map((navItem) => (
                  <Box key={navItem.label}>
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant="ghost"
                        rightIcon={navItem.children && <ChevronDownIcon />}
                        _hover={{
                          textDecoration: 'none',
                          color: activeColor,
                        }}
                      >
                        {navItem.label}
                      </MenuButton>
                      {navItem.children && (
                        <MenuList bg={menuBg}>
                          {navItem.children.map((child) => (
                            <MenuItem
                              key={child.label}
                              as={RouterLink}
                              to={child.href}
                              bg={location.pathname === child.href ? menuHoverBg : 'transparent'}
                              color={location.pathname === child.href ? activeColor : undefined}
                              _hover={{ bg: menuHoverBg }}
                            >
                              {child.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      )}
                    </Menu>
                  </Box>
                ))}
              </HStack>
            </Flex>
          </Flex>

          {/* Right side buttons */}
          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={6}
          >
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
            <Button
              as={RouterLink}
              to="/pricing"
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize="sm"
              fontWeight={600}
              colorScheme="purple"
              variant="outline"
            >
              Free Trial
            </Button>
          </Stack>
        </Flex>

        {/* Mobile Navigation */}
        <Collapse in={isOpen} animateOpacity>
          <Stack
            bg={bg}
            p={4}
            display={{ md: 'none' }}
          >
            {NAV_ITEMS.map((navItem) => (
              <Stack key={navItem.label} spacing={4}>
                <Text
                  fontWeight={600}
                  color={activeColor}
                >
                  {navItem.label}
                </Text>
                <Stack pl={4}>
                  {navItem.children?.map((child) => (
                    <RouterLink key={child.label} to={child.href}>
                      <Text
                        py={2}
                        color={location.pathname === child.href ? activeColor : undefined}
                      >
                        {child.label}
                      </Text>
                    </RouterLink>
                  ))}
                </Stack>
              </Stack>
            ))}
            <Button
              as={RouterLink}
              to="/pricing"
              w="full"
              fontSize="sm"
              fontWeight={600}
              colorScheme="purple"
              variant="outline"
            >
              Free Trial
            </Button>
          </Stack>
        </Collapse>
      </Container>
    </Box>
  );
};

export default Navbar; 