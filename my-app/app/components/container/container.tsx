import css from "./container.module.css";

const Container = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return <div className={css.container}>{children}</div>;
};

export default Container;
