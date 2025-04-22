'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  name: string;
  secret_phrase: string;
  embed: string;
  messages: string[];
}

export default function Home() {
  const [name, setName] = useState('');
  const [secretPhrase, setSecretPhrase] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [embed, setEmbed] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || '');
      const data = await response.json();

      if (Array.isArray(data.people)) {
        const person = data.people.find(
          (p: { name: string; secret_phrase: string }) =>
            p.name.trim().toLowerCase() === name.trim().toLowerCase() &&
            p.secret_phrase === secretPhrase.trim()
        );

        if (person) {
          setMessages(person.messages);
          setEmbed(person.embed); // Set embed URL
          setIsAuthenticated(true);
        } else {
          setError('Invalid name or secret phrase');
        }
      } else {
        setError('Invalid data format from server');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to authenticate. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-editorial mb-4">Letter Awaits</h1>
              <div className="h-px bg-border w-16 mx-auto mb-4"></div>
              <p className="text-muted-foreground font-serif italic">
                "A message awaits you in the quiet spaces between words..."
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background/50 border-border/50 backdrop-blur"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Enter your secret phrase"
                  value={secretPhrase}
                  onChange={(e) => setSecretPhrase(e.target.value)}
                  className="w-full bg-background/50 border-border/50 backdrop-blur"
                />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center font-serif">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              Open
            </Button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center italic font-light font-PP Editorial">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-serif mb-2 mt-7"
            >
              Dear {name.charAt(0).toUpperCase() + name.slice(1)}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-px bg-border w-32 mx-auto mb-4"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground font-serif italic"
            >
              A few messages for you...
            </motion.p>
          </div>

          <div className="space-y-8">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 + 0.8, duration: 0.8 }}
              >
                <p className="text-lg font-serif leading-relaxed tracking-wide">
                  {message}
                </p>
                <div className="h-px w-16 bg-border/30"></div>
              </motion.div>
            ))}

            {/* Embed Spotify Song if embed URL exists */}
            {embed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: messages.length * 0.3 + 1, duration: 0.8 }}
                className="text-center mt-12"
              >
                <p className="text-muted-foreground font-serif italic text-left">
                  Aapke liye ek gaana,
                </p>

                {/* Spotify Embed */}
                <div className="mt-4">
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src={`https://open.spotify.com/embed/track/${embed}?utm_source=generator`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: messages.length * 0.3 + 1.5, duration: 0.8 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground font-serif italic">
                Agar kuch kehne ka man kare...
              </p>
              <p className="mt-2 font-serif text-lg underline text-blue-500 hover:text-blue-600">
                <a href="mailto:shubham.gaur7116@gmail.com">Write back to me</a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
