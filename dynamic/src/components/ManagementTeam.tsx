import { motion } from 'framer-motion';
import Image from '@/components/Image';

interface TeamMember {
  name: string;
  title: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Ananth Krishna',
    title: 'Director',
    image: '/images/Ananth Sir.webp',
  },
  {
    name: 'Ashok Chauhan',
    title: 'Managing Director',
    image: '/images/Ashok.webp',
  },
];

export default function ManagementTeam() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gp-surface/5">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <span className="text-sm font-medium text-gp-accent uppercase tracking-wider">
              LEADERSHIP
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display font-bold text-gp-ink mt-4 mb-4"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            The Vision Behind Our Mission
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gp-ink/10">
                {/* Photo */}
                <div className="relative h-[450px] md:h-[500px] bg-gradient-to-br from-gp-surface to-gp-bg overflow-hidden px-4 pb-4 pt-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-contain object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Info */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-display font-bold text-gp-ink mb-2">
                    {member.name}
                  </h3>
                  <p className="text-base text-gp-ink-muted font-medium">
                    {member.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
