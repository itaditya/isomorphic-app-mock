import { fetch } from '../utils/mofetch';

const About = (props) => {
  return (
    <ul>
      {props.users.map((user) => (
        <li key={user.name}>
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  );
};

About.getInitialProps = async function () {
  const resTodos = await fetch('/api/users');
  const users = await resTodos.json();

  return {
    users,
  };
};

export default About;
