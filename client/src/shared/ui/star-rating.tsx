import styled from "styled-components";

type StarRatingProps = {
  rating: number;
};

export const StarRating = ({ rating }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;

  const stars = Array.from({ length: 5 }, (_, index) => {
    let fill = 0;
    if (index < fullStars) {
      fill = 1;
    } else if (index === fullStars) {
      fill = partialStar;
    }
    return <Star key={index} fill={fill} />;
  });

  return <StarContainer>{stars}</StarContainer>;
};

const StarContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.div<{ fill: number }>`
  width: 20px;
  height: 20px;
  background: linear-gradient(
    to right,
    #ffd700 0%,
    #ffd700 ${({ fill }) => fill * 100}%,
    #ccc ${({ fill }) => fill * 100}%,
    #ccc 100%
  );
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
`;
