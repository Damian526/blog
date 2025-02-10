import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  font-weight: bold;
`;

export const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

export const Row = styled.tr`
  &:nth-child(even) {
    background: #f9f9f9;
  }
`;
