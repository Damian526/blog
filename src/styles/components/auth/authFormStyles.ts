import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
`;

export const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #0070f3;
    outline: none;
    box-shadow: 0 0 3px rgba(0, 112, 243, 0.5);
  }
`;

export const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #005bb5;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
`;

export const SuccessMessage = styled.p`
  color: green;
  font-size: 0.9rem;
  text-align: center;
`;
