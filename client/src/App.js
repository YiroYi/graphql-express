import axios from "axios";

function App() {
  const addUserHandler = () => {
    const userData = {
      email: "kriptoyi@test.com",
      password: "test123",
    };

    axios({
      url: "graphql",
      method: "POST",
      data: {
        query:`
          mutation {
            addUser(userInput:{
              email: "${userData.email}",
              password: "${userData.password}"
            }){
              _id
              email
              password
            }
          }
        `
      }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <button onClick={addUserHandler}>Add User</button>
    </div>
  );
}

export default App;
