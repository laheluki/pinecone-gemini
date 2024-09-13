/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { similiaritySearch, Upsert } from '@/lib/pinecone';

export const Form = () => {
  const { toast } = useToast();
  const datasetRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;

  const searchRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [loading, setLoading] = useState<boolean>(false);

  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    const content = datasetRef.current.value;

    try {
      if (content && content.trim()) {
        const res = await fetch('/api/embedding', {
          method: 'POST',
          body: JSON.stringify({ text: content.replace(/\n/g, ' ') }),
        });

        const result = await res.json();

        const embedding = result.embedding;
        console.log('🚀 ~ handleSubmit ~ embedding:', embedding.values);

        await Upsert(content, embedding.values);

        toast({
          title: 'Succull embedding...',
          duration: 3000,
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: error.message,
        duration: 3000,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      datasetRef.current.value = '';
    }
  };

  async function SearchQuery() {
    try {
      setLoading(true);
      setResponse('');
      const r = await fetch('/api/embedding', {
        method: 'POST',
        body: JSON.stringify({
          text: searchRef.current.value.replace(/\n/g, ' '),
        }),
      });

      const result = await r.json();
      const embedding = result.embedding;

      const response = await similiaritySearch(embedding.values);

      const context = response.matches
        .map((match) => match.metadata?.values)
        .join('\n');

      const res = await fetch(location.origin + '/api/chat', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          text: searchRef.current.value.replace(/\n/g, ' '),
          context,
        }),
      });

      const resp = await res.json();
      console.log('🚀 ~ SearchQuery ~ resp:', resp);
      setResponse(resp.text);
    } catch (error: any) {
      toast({
        title: error.message,
        duration: 3000,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Textarea placeholder='dataset' className='h-20' ref={datasetRef} />
      <Button className='w-full flex gap-2' onClick={handleSubmit}>
        {loading && (
          <AiOutlineLoading3Quarters className='w-5 h-5 animate-spin' />
        )}
        Submit
      </Button>

      <hr />
      <div className='mt-5 flex items-center justify-between gap-5'>
        <Input placeholder='Search...' ref={searchRef} />
        <Button onClick={SearchQuery}>
          {loading && (
            <AiOutlineLoading3Quarters className='w-5 h-5 animate-spin' />
          )}
          Search
        </Button>
      </div>

      {/* response ai */}
      {response && (
        <span className='flex bg-slate-300 rounded-md'>
          <p className='p-2 text-black'>{response}</p>
        </span>
      )}
    </>
  );
};
