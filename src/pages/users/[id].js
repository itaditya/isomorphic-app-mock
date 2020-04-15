import { fetch } from '../../utils/mofetch';

const User = (props) => {
  return (
    <div>
      {props.user.name}
    </div>
  );
};

User.getInitialProps = async function (context) {
  const { id } = context.query;
  const resUser = await fetch(`/api/users/${id}?prefix=Mocked Some`);
  const user = await resUser.json();

  return {
    user,
  };
};

export default User;
