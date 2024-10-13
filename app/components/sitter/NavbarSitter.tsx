import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react'
import React from 'react'

const NavbarSitter = () => {
    return (
        <Navbar maxWidth="full" className='bg-transparent'>
            <NavbarContent className="" justify="end">
                <NavbarItem>
                    <Button variant='bordered' className='text-black'>
                        <FontAwesomeIcon icon={faFloppyDisk} />
                        Lưu lại
                    </Button>
                </NavbarItem>

            </NavbarContent>
        </Navbar>

    )
}

export default NavbarSitter