import React, { Fragment } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Button from "../components/ui/Button";
import Logo from "../components/ui/Logo";
import Modal from "../components/ui/Modal";
import classes from "./LoginRegisterPage.module.css";
import Confirm from "../components/auth/Confirm";

function LoginRegisterPage(props) {
    // const [modalIsClosed, setModalIsClosed] = useState(true);
    const history = useHistory();
    const { path, url } = useRouteMatch();

    function toggleLoginModalHandler() {
        history.push(`${url}/login`);
    }
    function toggleRegisterModalHandler() {
        history.push(`${url}/register`);
    }
    function closeModalHandler() {
        history.push(`${url}`);
    }

    function toConfirmPage() {
        history.push(`${url}/confirm`);
    }

    return (
        <Fragment>
            <section className={classes.mainpage}>
                <div className={classes.sidebar}>
                    <Logo />
                    <div className={classes.buttons}>
                        <Button
                            className={classes.butn}
                            onClick={toggleLoginModalHandler}
                        >
                            Login
                        </Button>
                        <Button
                            className={classes.butn}
                            onClick={toggleRegisterModalHandler}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </section>
            <Switch>
                <Route path={`${path}/login`}>
                    <Modal onClose={closeModalHandler}>
                        <Login />
                    </Modal>
                </Route>
                <Route path={`${path}/register`}>
                    <Modal onClose={closeModalHandler}>
                        <Register onToConfirm={toConfirmPage}/>
                    </Modal>
                </Route>
                <Route path={`${path}/confirm`}>
                    <Modal onClose={closeModalHandler}>
                        <Confirm />
                    </Modal>
                </Route>
            </Switch>
        </Fragment>
    );
}

export default LoginRegisterPage;
