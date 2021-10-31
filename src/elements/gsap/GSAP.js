import { useState, useEffect, useRef } from 'react';

import { gsap } from 'gsap';

// ==============================================

// React Components map props into elements
const GSAP = () => {
  // --------------------------------------------

  const div_ref = useRef();

  // --------------------------------------------

  const [animation_state, set_animation_state] = useState(false);

  // --------------------------------------------

  useEffect(() => {
    if (animation_state) {
      gsap.to(div_ref.current, { rotation: '+=360' });
      set_animation_state(false);
    }
  }, [animation_state]);

  // --------------------------------------------

  return (
    <div
      ref={div_ref}
      onClick={() => set_animation_state(true)}
      style={{ height: '100px', width: '100px', background: 'red' }}
    ></div>
  );

  // --------------------------------------------
};

// ==============================================

export default GSAP;
