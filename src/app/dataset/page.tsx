import { Form } from './_components/Form';

export default function DatasetPage() {
  return (
    <div className='max-w-4xl mx-auto flex justify-center items-center'>
      <div className='w-full p-5 space-y-3'>
        <p className='text-center text-2xl'>
          👨🏽‍🦼 Pinecone vector dataset experiment with gemini-1.5-pro model
        </p>

        <Form />
      </div>
      <p className='absolute bottom-0 mb-2 text-foreground text-sm'>
        Sponsored by tepung bumbu serba guna @SAJIKU.
      </p>
    </div>
  );
}
