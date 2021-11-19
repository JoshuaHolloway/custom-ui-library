import css from './card.module.scss';

export default function Card() {
  return (
    <div
      className='temp-container'
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <div className={css.card}>
        <div className={css.card_content}>
          <h2 className={css.card_title}>Title</h2>
          <p className={css.card_body}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas
            mollitia fuga deleniti culpa, velit obcaecati!
          </p>
          <a href='#' className={css.button}>
            button
          </a>
        </div>
      </div>
    </div>
  );
}
