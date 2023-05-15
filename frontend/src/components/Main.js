import { Link } from 'react-router-dom';
import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';

function Main() {

    // if user is already logged in, redirect to landing page
    useRedirectIfLoggedIn();

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Main;
