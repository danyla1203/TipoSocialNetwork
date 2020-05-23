import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import propTypes from "prop-types";

import Home from "./Home";
import UsersList from "./UsersList";
import UserHome from "./UserHome";
import FriendsList from "./FriendsList";
import UserMessages from "./messages/UserMessages";
import UserMessagesList from "./messages/UserMessagesList";
import News from "./News";
import AddArticle from "./articles/AddArticle";
import Settings from "./Settings";
import HelloPage from "./HelloPage";
import Header from "./Header";

function UserRouter(props) {
    let user = props.smallUser;
    let fullUser = props.fullUser;
    let thisProps = props;
    let token = props.token;
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" >
                    <HelloPage token={token} name={ user.name } />
                </Route>
                <Route exact path="/user" >
                    <Home user={ fullUser } token={token}/>
                </Route>

                <Route exact path="/users/list" >
                    <UsersList token={token} user={ user }/> 
                </Route>

                <Route exact path="/messages/" 
                    render={ () => <UserMessagesList {...thisProps} token={ token } user_data={ user } /> } 
                />

                <Route exact path="/users/message/:user_id"
                    render={(props) => <UserMessages {...props} token={token} user={ user } />}
                />
                    
                <Route exact path="/edit-article/:article_id" 
                    render={(props) => <AddArticle {...props} user={user} isEdit={ true } token={token} />}                        
                />

                <Route exact path="/settings">
                    <Settings token={token} userData={ fullUser } changeUserData={ props.changeUserData }/>
                </Route>

                <Route exact path="/add-article">
                    <AddArticle token={token} user_id={ user.user_id } isEdit={ false }/>
                </Route>

               <Route path="/users/:userID" 
                    render={(props) => <UserHome {...props} token={ token } guest_user={ user } />} 
                />

                <Route exact path="/friends">
                    <FriendsList user_id={ user.user_id } token={token} />
                </Route>

                <Route exact path="/news">
                    <News guest _user={ user } token={token}/>
                </Route>
                
                <Route>Error 404.</Route>
            </Switch>
        </Router>   
    );
}

UserRouter.propTypes = {
    token: propTypes.string.isRequired,
    changeUserData: propTypes.func.isRequired,
    fullUser: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        email: propTypes.string,
        country: propTypes.string,
        gender: propTypes.string,
        avatar_url_full: propTypes.string,
    }),
    smallUser: propTypes.exact({
        user_id: propTypes.number,
        name: propTypes.string,
        country: propTypes.string,
        email: propTypes.string,
        gender: propTypes.string,
        avatar_url_icon: propTypes.string,
    }),
};


export default UserRouter;