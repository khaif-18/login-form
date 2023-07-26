import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { userService } from '@/services/user.service';
import Link from 'next/link';
import { alertService } from '@/services/alert.service';

interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
}

export { AddEdit };

function AddEdit(props: { user: UserData | null }) {
  const user = props?.user;
  const isAddMode = !user;
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .transform((x) => (x === '' ? undefined : x))
      .min(6, 'Password must be at least 6 characters'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };


  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm(formOptions);

  function onSubmit(data: UserData) {
    return isAddMode ? createUser(data) : updateUser(user?.id, data);
  }

  function createUser(data: UserData) {
    return userService.register(data).then(() => {
      alertService.success('User added', { keepAfterRouteChange: true });
      router.push('.');
    });
    // .catch(alertService.error);
  }

  function updateUser(id: number | undefined, data: UserData) {
    if (id) {
      return userService.update(id.toString(), data).then(() => {
        alertService.success('User updated', { keepAfterRouteChange: true });
        router.push('..');
      });
      // .catch(alertService.error);
    }
    return Promise.resolve();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group col">
          <label>First Name</label>
          <input
            type="text"
            {...register('firstName')}
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>
        <div className="form-group col">
          <label>Last Name</label>
          <input
            type="text"
            {...register('lastName')}
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col">
          <label>Username</label>
          <input
            type="text"
            {...register('username')}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>
        <div className="form-group col">
          <label>
            Password
            {!isAddMode && (
              <em className="ml-1">(Leave blank to keep the same password)</em>
            )}
          </label>
          <input
            type="password"
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
      </div>
      <div className="form-group">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mr-2"
        >
          {isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Save
        </button>
        <button
        //   onClick={() => reset(formOptions.defaultValues)}
          type="button"
          disabled={isSubmitting}
          className="btn btn-secondary"
        >
          Reset
        </button>
        <Link href="/users" className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}
