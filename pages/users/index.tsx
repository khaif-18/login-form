import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Spinner } from '@/components/Spinner';
import { userService } from '@/services/user.service';
import { Layout } from '@/components/users/Layout';

// Define CSS variables
const thCellStyle: React.CSSProperties = { width: '30%' };
const tdCellStyle: React.CSSProperties = { whiteSpace: 'nowrap' };

export default function Index() {
    const [users, setUsers] = useState<any[] | null>(null);

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
    }, []);

    function deleteUser(id: string) {
        if (users) {
            setUsers(users.map(x => {
                if (x.id === id) { x.isDeleting = true; }
                return x;
            }));

            userService.delete(id).then(() => {
                setUsers(users.map(x => {
                    if (x.id === id) { x.isDeleting = true; }
                    return x;
                }));
            });
        }
    }

    return (
        <Layout>
            <h1>Users</h1>
            <Link href="/users/add" className="btn btn-sm btn-success mb-2">Add User</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={thCellStyle}>First Name</th>
                        <th style={thCellStyle}>Last Name</th>
                        <th style={thCellStyle}>Username</th>
                        <th style={{ ...thCellStyle, width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users ? (
                        users.map(user =>
                            <tr key={user.id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.username}</td>
                                <td style={tdCellStyle}>
                                    <Link href={`/users/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                    <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                        {user.isDeleting
                                            ? <span className="spinner-border spinner-border-sm"></span>
                                            : <span>Delete</span>
                                        }
                                    </button>
                                </td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan={4}>
                                <Spinner />
                            </td>
                        </tr>
                    )}
                    {!users || (users && !users.length) &&
                        <tr>
                            <td colSpan={4} className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
