/**
 * 포스터 이미지의 URL를 생성하는 함수
 * @param path 포스터 상대 주소
 * @param format 포스터 크기 포멧 (ex: w500), default value: original
 * @returns
 */
export function makeImagePath(path: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format || 'original'}${path}`;
}
