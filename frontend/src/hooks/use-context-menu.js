import { useEffect, useRef, useState } from 'react';

const useContextMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const menuRef = useRef(null);

    const handleContextMenu = (event, messageId) => {
        event.preventDefault();
        setCurrentItemId(messageId);
        setShowMenu(true);
    };

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    const handleMenuClick = (callback) => {
        setShowMenu(false);
        callback(currentItemId);
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return { showMenu, menuRef, handleContextMenu, handleMenuClick };
}

export default useContextMenu;
