import { routeAction$ } from '@builder.io/qwik-city';
import type { APIEmbed, RESTPostAPIChannelMessageResult } from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';
import { EmbedBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { component$ } from '@builder.io/qwik';

export const usePostEmbed = routeAction$(async (embed: APIEmbed, ev) => {
  const token = String(ev.env.get('DISCORD_APP_TOKEN'));
  const channelId = String(ev.env.get('DISCORD_CHANNEL_ID'));
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    const sendEmbedResult = await rest.post(Routes.channelMessages(channelId), {
      body: {
        embeds: [embed],
      },
    }) as Promise<RESTPostAPIChannelMessageResult>;
    console.log({ sendEmbedResult });
    return sendEmbedResult;
  } catch (error) {
    console.error(error);
  }
});

export default component$(() => {
  const action = usePostEmbed();

  // TODO: get this from the database
  const annoyanceCount = 1;

  return <div>
    <h1>Hello, Jack!</h1>
    <button onClick$={() => {
      const embed = new EmbedBuilder()
        .setTitle('Hello, Jack!')
        .setDescription('hello from the internet!')
        .setFields([{
          name: 'come in for a cuppa tea?',
          value: "Dwi'n hoffi coffi",
        }, {
          name: `this button has been clicked ${annoyanceCount} times! WOW!`,
          value: "incroyable",
        }]).setFooter({
          text: 'British Tea Cup',
          iconURL: 'https://cdn3.vectorstock.com/i/1000x1000/26/02/british-tea-cup-icon-isometric-3d-style-vector-7902602.jpg',
        }).toJSON() as Record<string, unknown>
      
      action.submit(embed)
    }}>Ping Jack</button>
  </div>;
});