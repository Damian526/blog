import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const TitleHeading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

export const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

export const Button = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #005bb5;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;
