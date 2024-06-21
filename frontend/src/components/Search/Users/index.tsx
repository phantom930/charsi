import { useState, useEffect } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";

import UserInfo from "@components/Account/UserInfo";
import { SEARCH_USERS_BY_PATTERN_QUERY } from "@store/user/user.graphql";
import { UserQueryData } from "@store/user/user.slice";
import client from "@/graphql";

export interface UsersProps {
  pattern: string;
}

const Users = ({ pattern }: UsersProps) => {
  const [users, setUsers] = useState<UserQueryData[]>([]);

  useEffect(() => {
    (async () => {
      if (pattern) {
        const { data } = await client.query({
          query: SEARCH_USERS_BY_PATTERN_QUERY,
          variables: { input: pattern },
        });
        setUsers((data as any).users);
      }
    })();
  }, [pattern]);

  return (
    <Grid container>
      {users.map((user) => (
        <Grid item xs={4} key={user.id}>
          <Link href={`/account/profile/${user.username}`}>
            <UserInfo user={user} />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default Users;
