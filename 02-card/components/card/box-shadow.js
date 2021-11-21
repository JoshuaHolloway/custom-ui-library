import css from './box-shadow.module.scss';

// ==============================================

export default function BoxShadow() {
  return (
    <div className={`${css.content} ${css.pseudo_hover}`}>
      <h1 className={css.title}>Smooth as butter</h1>
      <p>
        Lorem ipsum dolor, <a href='#'>sit amet consectetur</a> adipisicing
        elit. Aliquid sapiente perferendis nulla sed consequuntur eveniet.
        Itaque veritatis qui labore quia odio nihil, magni soluta facilis
        necessitatibus cumque repellendus optio laborum.
      </p>
    </div>
  );
}
