  import { User } from '../generated/graphql';


  const users: User[] = [
    {
      id: "0",
      username: "TheRyaz",
      name: "Ryan",
      email: "ryan.lawson@v-eden.com",
      password: "123456",
    },
    {
      id: "1",
      username: "KristaChan",
      name: "Krista",
      email: "krista.lawson@v-eden.com",
      password: "789890",
    }
  ];

  export function getUsers(){
    return users;
  }

  export function getUserById(id: string){
    return users.find(u => u.id === id);
  }

  export function getUserByUsername(username: string){
    return users.find(u => u.username === username);
  }

  export function addUser(user){
    return users.push(user);
  }