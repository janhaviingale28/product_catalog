interface Props {
  value: number;
  max?: number;
}

/** Star rating with an accessible text alternative. */
export default function Rating({ value, max = 5 }: Props) {
  const rounded = Math.round(value);
  return (
    <span className="rating" role="img" aria-label={`Rated ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} aria-hidden="true" className={i < rounded ? 'star star--on' : 'star'}>★</span>
      ))}
    </span>
  );
}
