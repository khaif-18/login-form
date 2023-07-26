import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link, { LinkProps } from 'next/link';


interface NavLinkProps extends LinkProps {
  exact?: boolean;
  className?: string;
}

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

NavLink.defaultProps = {
  exact: false,
};

export function NavLink({ href, exact, ...props }: NavLinkProps) {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href as string);

  if (isActive) {
    props.className = `${props.className || ''} active`;
  }

  return <Link href={href} {...props} />;
}
